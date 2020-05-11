using ActuaryUtilities

using Dates
using Test
using Interpolations

import DayCounts

include("financial_math.jl")

@testset "Temporal functions" begin
    @testset "years_between" begin
        @test years_between(Date(2018,9,30),Date(2018,9,30)) == 0
        @test years_between(Date(2018,9,30),Date(2018,9,30),true) == 0
        @test years_between(Date(2018,9,30),Date(2019,9,30),false) == 0
        @test years_between(Date(2018,9,30),Date(2019,9,30),true) == 1
        @test years_between(Date(2018,9,30),Date(2019,10,1),true) == 1
        @test years_between(Date(2018,9,30),Date(2019,10,1),false) == 1
    end

    @testset "duration tests" begin
        @test duration(Date(2018,9,30),Date(2019,9,30)) == 2
        @test duration(Date(2018,9,30),Date(2018,9,30)) == 1
        @test duration(Date(2018,9,30),Date(2018,10,1)) == 1
        @test duration(Date(2018,9,30),Date(2019,10,1)) == 2
        @test duration(Date(2018,9,30),Date(2018,6,30)) == 0
        @test duration(Date(2018,9,30),Date(2017,6,30)) == -1
        @test duration(Date(2018,10,15),Date(2019,9,30)) == 1
        @test duration(Date(2018,10,15),Date(2019,10,30)) == 2
        @test duration(Date(2018,10,15),Date(2019,10,15)) == 2
        @test duration(Date(2018,10,15),Date(2019,10,14)) == 1
    end
end

@testset "financial calcs" begin

    @testset "pv" begin
        cf = [100, 100]
        
        @test pv(0.05,cf) ≈ cf[1] / 1.05 + cf[2] / 1.05^2
    end

    @testset "pv with timepoints" begin
        cf = [100, 100]

        @test pv(0.05,cf,[1,2]) ≈ cf[1] / 1.05 + cf[2] / 1.05^2
    end

    @testset "pv with vector discount rates" begin
        cf = [100, 100]
        @test pv([0.0,0.05],cf) ≈ 100 / 1.0 + 100 / 1.05
        @test pv([0.05,0.0],cf) ≈ 100 / 1.05 + 100 / 1.05
        @test pv([0.05,0.1],cf) ≈ 100 / 1.05 + 100 / 1.05 / 1.1

        ts = [0.5,1]
        @test pv([0.0,0.05],cf,ts) ≈ 100 / 1.0 + 100 / 1.05 ^ 0.5 
        @test pv([0.05,0.0],cf,ts) ≈ 100 / 1.05 ^ 0.5 + 100 / 1.05 ^ 0.5 
        @test pv([0.05,0.1],cf,ts) ≈ 100 / 1.05 ^ 0.5 + 100 / (1.05 ^ 0.5) / (1.1 ^ 0.5)



    end


    @testset "irr" begin

        v = [-70000,12000,15000,18000,21000,26000]
        
        # per Excel (example comes from Excel help text)
        @test isapprox(irr(v[1:2]), -0.8285714285714,atol = 0.001)
        @test isapprox(irr(v[1:3]), -0.4435069413346,atol = 0.001)
        @test isapprox(irr(v[1:4]), -0.1821374641455,atol = 0.001)
        @test isapprox(irr(v[1:5]), -0.0212448482734,atol = 0.001)
        @test isapprox(irr(v[1:6]),  0.0866309480365,atol = 0.001)

        # much more challenging to solve b/c of the overflow below zero
        cfs = [t % 10 == 0 ? -10 : 1.5 for t in 0:99]

        @test isapprox(irr(cfs), 0.06463163963925866,atol=0.001)

        # test the unsolvable

        @test isnothing(irr([100,100]))

    end

    @testset "xirr with float times" begin

    
        @test isapprox(irr([-100,100],[0,1]), 0.0, atol =0.001)
        @test isapprox(irr([-100,110],[0,1]), 0.1, atol =0.001)

    end

    @testset "xirr with real dates" begin

    v = [-70000,12000,15000,18000,21000,26000]
    dates = Date(2019,12,31):Year(1):Date(2024,12,31)
    times = map(d -> DayCounts.yearfrac(dates[1],d,DayCounts.Thirty360()),dates)
    # per Excel (example comes from Excel help text)
    @test isapprox(irr(v[1:2], times[1:2]), -0.8285714285714, atol = 0.001)
    @test isapprox(irr(v[1:3], times[1:3]), -0.4435069413346, atol = 0.001)
    @test isapprox(irr(v[1:4], times[1:4]), -0.1821374641455, atol = 0.001)
    @test isapprox(irr(v[1:5], times[1:5]), -0.0212448482734, atol = 0.001)
    @test isapprox(irr(v[1:6], times[1:6]),  0.0866309480365, atol = 0.001)

    end
end

@testset "Breakeven time" begin

    @testset "basic" begin
        @test breakeven([-10,1,2,3,4,8],0.10) == 5
        @test breakeven([-10,15,2,3,4,8],0.10) == 1
        @test breakeven([-10,15,2,3,4,8],0.10) == 1
        @test isnothing(breakeven([-10,-15,2,3,4,8],0.10))
    end

    @testset "basic with vector interest" begin
        @test breakeven([-10,1,2,3,4],[1,2,3,4,5],0.0) == 5
        # 
        @test isnothing(breakeven([-10,1,2,3,4],[1,2,3,4,5],[0.0,0.0,0.0,0.0,0.1]))
        @test breakeven([-10,1,2,3,4],[1,2,3,4,5],[0.0,0.0,0.0,0.0,-0.5]) == 5
        @test breakeven([-10,1,2,3,4],[1,2,3,4,5],[0.0,0.0,0.0,-0.9,-0.5]) == 4
        @test breakeven([-10,1,12,3,4],[1,2,3,4,5],[0.1,0.1,0.2,0.1,0.1]) == 3
    end

    @testset "timepoints" begin
        times = [t for t in 0:5]
        @test breakeven([-10,1,2,3,4,8],times,0.10) == 5
        @test breakeven([-10,15,2,3,4,8],times,0.10) == 1
        @test breakeven([-10,15,2,3,4,8],times,0.10) == 1
        @test isnothing(breakeven([-10,-15,2,3,4,8],times,0.10))
    end
end

@testset "duration" begin
    
    @testset "wikipedia example" begin
        times = [0.5,1,1.5,2]
        cfs = [10,10,10,110]
        V = present_value(0.04,cfs,times)

        @test duration(Macaulay(), 0.04,cfs,times) ≈ 1.777570320376649
        @test duration(Modified(), 0.04,cfs,times) ≈ 1.777570320376649 / (1 + 0.04)
        @test duration(DV01(), 0.04,cfs,times) ≈ 1.777570320376649 / (1 + 0.04) * V / 100

    end
end


include("run_doctests.jl")